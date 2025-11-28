import { GraduationCap } from 'lucide-react';

const Footer = () => {
    return (
        <>
            <footer className="bg-[#243B53] text-white text-xs p-8 mt-auto border-t-4 border-[#006D77]">
                <div className="max-w-6xl mx-auto opacity-80 space-y-3 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                        <GraduationCap size={24} />
                        <span className="font-bold text-lg tracking-wide">HCMUT E-Learning</span>
                    </div>
                    <p className="font-medium uppercase tracking-wider text-[#BCCCDC]">Tổ kỹ thuật / Technician Support</p>
                    <p>Email: <a href="mailto:ddtbua@hcmut.edu.vn" className="text-[#48C0E0] hover:underline">ddtbua@hcmut.edu.vn</a></p>
                    <p>ĐT (Tel.): (84-8) 38647256 - 7200</p>
                    <div className="pt-6 border-t border-white/10 mt-4 text-[10px] opacity-60">
                        © 2025 Ho Chi Minh City University of Technology. All rights reserved.
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;