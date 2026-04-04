import numpy as np
from sklearn.neighbors import NearestNeighbors

class RecommendationService:
    @staticmethod
    def build_vocab(mentors_features):
        """Build a vocabulary dynamically from the entire feature space of mentors"""
        vocab = {
            "format":           set(),
            "availability":     set(),
            "class_size":       set(),
            "method":           set(),
            "domain":           set(),
            "soft_skills":      set(),
            "domain_skills":    set(),
            "development_path": set(),
        }
        for mentor in mentors_features:
            hf = mentor.get("hard_filters", {})
            hs = mentor.get("hard_skills", {})
            sp = hs.get("specific_skills", {})
            vb = mentor.get("vibe", {})

            if "format" in hf:
                vocab["format"].add(hf["format"])
            if "class_size" in hf:
                vocab["class_size"].add(hf["class_size"])
            
            domain = hs.get("domain", "")
            if isinstance(domain, list):
                for d in domain:
                    vocab["domain"].add(d)
            elif domain:
                vocab["domain"].add(domain)

            for v in hf.get("availability", []):
                vocab["availability"].add(v)
            for v in hs.get("method", []):
                vocab["method"].add(v)
            for v in sp.get("soft_skills", []):
                vocab["soft_skills"].add(v)
            for v in sp.get("domain_skills", []):
                vocab["domain_skills"].add(v)
            for v in vb.get("development_path", []):
                vocab["development_path"].add(v)

        return {k: sorted(list(v)) for k, v in vocab.items()}

    @staticmethod
    def multihot(values_list, vocab_list):
        vec = np.zeros(len(vocab_list), dtype=float)
        for v in values_list:
            if v in vocab_list:
                vec[vocab_list.index(v)] = 1.0
        return vec

    @staticmethod
    def onehot(value, vocab_list):
        vec = np.zeros(len(vocab_list), dtype=float)
        if value in vocab_list:
            vec[vocab_list.index(value)] = 1.0
        return vec

    @classmethod
    def user_to_vector(cls, features, vocab):
        hf = features.get("hard_filters", {})
        hs = features.get("hard_skills", {})
        sp = hs.get("specific_skills", {})
        vb = features.get("vibe", {})

        domain = hs.get("domain", "")
        if isinstance(domain, list):
            domain_vec = cls.multihot(domain, vocab["domain"])
        else:
            domain_vec = cls.onehot(domain, vocab["domain"])

        parts = [
            cls.onehot(hf.get("format", ""), vocab["format"]),
            cls.multihot(hf.get("availability", []), vocab["availability"]),
            cls.onehot(hf.get("class_size", ""), vocab["class_size"]),
            cls.multihot(hs.get("method", []), vocab["method"]),
            domain_vec,
            cls.multihot(sp.get("soft_skills", []), vocab["soft_skills"]),
            cls.multihot(sp.get("domain_skills", []), vocab["domain_skills"]),
            np.array([sp.get("life_skills", 0) / 1.0]),
            cls.multihot(vb.get("development_path", []), vocab["development_path"]),
            np.array([vb.get("energy_scale", 1) / 5.0]),  # normalize 1-5
        ]
        return np.concatenate(parts)

    @staticmethod
    def is_valid_mentor(student_features, mentor_features):
        hf_s = student_features.get("hard_filters", {})
        hf_m = mentor_features.get("hard_filters", {})
        hs_s = student_features.get("hard_skills", {})
        hs_m = mentor_features.get("hard_skills", {})
        
        domain_m = hs_m.get("domain", "")
        domain_s = hs_s.get("domain", [])
        if not isinstance(domain_s, list):
            domain_s = [domain_s]
            
        if domain_m not in domain_s:
            return False
            
        format_s = hf_s.get("format", "")
        format_m = hf_m.get("format", "")
        if format_s == "Online" and format_m not in ["Online", "Hybrid"]:
            return False
        if format_s == "Offline" and format_m not in ["Offline", "Hybrid"]:
            return False

        avail_s = set(hf_s.get("availability", []))
        avail_m = set(hf_m.get("availability", []))
        if not avail_s.intersection(avail_m):
            return False

        class_sizes_order = [
            "1-1", 
            "Nhóm nhỏ (<20)", 
            "Nhóm vừa (<40)", 
            "Seminar (>40)"
        ]
        size_s = hf_s.get("class_size", "")
        size_m = hf_m.get("class_size", "")
        
        try:
            if size_s and size_m and size_s in class_sizes_order and size_m in class_sizes_order:
                idx_s = class_sizes_order.index(size_s)
                idx_m = class_sizes_order.index(size_m)
                if abs(idx_s - idx_m) > 1:
                    return False
        except ValueError:
            return False 

        return True

    @classmethod
    def score_all_tutors(cls, student_features, tutors_list):
        scored_tutors = []
        features_list = []
        
        # We build vocab on ALL tutors to keep distance dimension consistent.
        for t in tutors_list:
            features_list.append(t.get("description", {}).get("features", {}))
        vocab = cls.build_vocab(features_list)
        
        # If student has no features (empty survey), return 0 point or -1 for all
        if not student_features or not student_features.get("hard_filters"):
            for t in tutors_list:
                result = t.copy()
                result["matched"] = -1
                scored_tutors.append(result)
            return scored_tutors
            
        filtered_X = np.array([cls.user_to_vector(tf, vocab) for tf in features_list])
        
        try:
            model = NearestNeighbors(
                n_neighbors=len(filtered_X), 
                metric="cosine", 
                algorithm="brute"
            )
            model.fit(filtered_X)

            query_vec = cls.user_to_vector(student_features, vocab).reshape(1, -1)
            distances, indices = model.kneighbors(query_vec)
            
            # Reconstruct list with scores
            for dist, idx in zip(distances[0], indices[0]):
                similarity = 1 - dist
                tutor_result = tutors_list[idx].copy()
                
                # Verify hard filters
                if cls.is_valid_mentor(student_features, tutor_result.get("description", {}).get("features", {})):
                    tutor_result["matched"] = round(similarity, 4)
                else:
                    tutor_result["matched"] = -1 # failed hard filter
                    
                scored_tutors.append(tutor_result)
        except Exception:
            # fallback
            for t in tutors_list:
                result = t.copy()
                result["matched"] = -1
                scored_tutors.append(result)
            
        return scored_tutors
