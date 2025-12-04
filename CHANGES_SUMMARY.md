# Tóm tắt các thay đổi - Exception Handling & Validation

---

## 1. TẠO MỚI - File Validation Utility

### File: `frontend/src/utils/validation.js` (MỚI)

**Chức năng:** Tạo module validation tập trung để kiểm tra dữ liệu form

**Các hàm được tạo:**

#### `validateDate(dateString)`

- Kiểm tra ngày không được để trống
- Kiểm tra ngày có hợp lệ không
- Kiểm tra ngày không được ở quá khứ
- **Return:** `{valid: boolean, error: string}`

#### `validateTime(timeString)`

- Kiểm tra thời gian không được để trống
- Kiểm tra định dạng HH:MM (regex: `/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/`)
- **Return:** `{valid: boolean, error: string}`

#### `validateDuration(duration)`

- Kiểm tra duration không được để trống
- Kiểm tra duration phải là số
- Kiểm tra duration tối thiểu 15 phút
- Kiểm tra duration tối đa 480 phút (8 giờ)
- Kiểm tra duration phải là bội số của 5
- **Return:** `{valid: boolean, error: string}`

#### `validateURL(url, required)`

- Kiểm tra URL có hợp lệ không
- Support optional field (required=false)
- **Return:** `{valid: boolean, error: string}`

#### `validateTitle(title, minLength, maxLength)`

- Kiểm tra tiêu đề không được để trống
- Kiểm tra độ dài tối thiểu (mặc định 3 ký tự)
- Kiểm tra độ dài tối đa (mặc định 200 ký tự)
- **Return:** `{valid: boolean, error: string}`

#### `validateSessionForm(formData)`

- **Check tổng quát:** Kiểm tra các trường bắt buộc (title, date, startTime, duration)
- Gọi tất cả các hàm validation trên
- Kiểm tra location bắt buộc khi offline
- Kiểm tra meetLink (optional) khi online
- Kiểm tra thời gian session phải ở tương lai
- **Return:** `{valid: boolean, errors: Object}`

#### `formatApiError(error)`

- Format lỗi từ API thành message dễ đọc
- **Return:** `string`

#### `displayValidationErrors(errors)`

- Hiển thị tất cả lỗi validation dưới dạng danh sách
- **Return:** `string`

---

## 2. THAY ĐỔI - Tutor ConsultationCreate

### File: `frontend/src/pages/tutor/ConsultationCreate/index.jsx`

#### **Import thêm:**

```javascript
import {
  validateSessionForm,
  displayValidationErrors,
  formatApiError,
} from "../../../utils/validation";
```

#### **State mới:**

```javascript
const [errors, setErrors] = useState({}); // Lưu errors từ validation
const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái đang submit
```

#### **Thay đổi hàm `handleSubmit()`:**

**Code CŨ:**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  // Validate required fields
  if (
    !formData.title ||
    !formData.date ||
    !formData.startTime ||
    !formData.duration
  ) {
    alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
    return;
  }
  // Handle form submission
  const confirmSave = window.confirm("Bạn có chắc chắn muốn lưu thay đổi?");
  if (confirmSave) {
    try {
      await sessionApi.create(uID, formData);
      alert("Tạo buổi tư vấn thành công!");
      navigate("/tutor/" + uID + "/sessions/");
    } catch (error) {
      alert("Lỗi khi lưu dữ liệu!");
    }
  }
};
```

**Code MỚI:**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  // Clear previous errors
  setErrors({});

  // Prepare form data for validation
  const dataToValidate = {
    title: formData.title,
    date: formData.date,
    startTime: formData.startTime,
    duration: formData.duration,
    isOnline: locationToggle,
    meetLink: locationToggle ? formData.meetLink : "",
    location: !locationToggle ? formData.location : "",
  };

  // Validate form data
  const validation = validateSessionForm(dataToValidate);

  if (!validation.valid) {
    setErrors(validation.errors);
    alert(displayValidationErrors(validation.errors));
    return;
  }

  // Confirm submission
  const confirmSave = window.confirm(
    "Bạn có chắc chắn muốn tạo buổi tư vấn này?"
  );
  if (!confirmSave) return;

  setIsSubmitting(true);

  try {
    // Prepare data for API
    const submitData = {
      ...formData,
      isOnline: locationToggle,
      duration: parseInt(formData.duration),
    };

    await sessionApi.create(uID, submitData);
    alert("Tạo buổi tư vấn thành công!");
    navigate("/tutor/" + uID + "/sessions/");
  } catch (error) {
    console.error("Lỗi khi tạo buổi tư vấn:", error);
    const errorMessage = formatApiError(error);
    alert("Lỗi khi tạo buổi tư vấn: " + errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
```

**Điểm khác biệt:**

1. ✅ Validation toàn diện trước khi submit
2. ✅ Hiển thị tất cả lỗi cùng lúc (không chỉ 1 lỗi)
3. ✅ Lưu errors vào state để hiển thị trên UI
4. ✅ Parse error message từ API chi tiết hơn
5. ✅ Thêm isSubmitting để disable button khi đang xử lý
6. ✅ Convert duration sang integer trước khi gửi API

#### **Thay đổi JSX - Các input fields:**

**Field Title:**

```jsx
// CŨ:
<input className={inputStyle} required />

// MỚI:
<input className={`${inputStyle} ${errors.title ? 'border-red-500' : ''}`} required />
{errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
```

**Field Date:**

```jsx
// MỚI: Thêm class border-red-500 khi có lỗi
<input className={`${inputStyle} ${errors.date ? "border-red-500" : ""}`} />;
{
  errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>;
}
```

**Field Start Time:**

```jsx
// MỚI: Thêm validation error display
<input
  type="time"
  className={`${inputStyle} ${errors.startTime ? "border-red-500" : ""}`}
/>
```

**Field Duration:**

```jsx
// CŨ:
<input type="text" name="duration" placeholder="Thời lượng (phút)" />

// MỚI:
<input
    type="number"
    name="duration"
    placeholder="Phút"
    min="15"
    max="480"
    step="5"
    className={`${inputStyle} ${errors.duration ? 'border-red-500' : ''}`}
/>
{(errors.startTime || errors.duration || errors.dateTime) && (
    <p className="text-red-500 text-xs mt-1">
        {errors.startTime || errors.duration || errors.dateTime}
    </p>
)}
```

**Field Location (Offline):**

```jsx
// CŨ:
<input type="text" name="location" />

// MỚI:
<input
    type="text"
    name="location"
    className={`${inputStyle} pl-8 ${errors.location ? 'border-red-500' : ''}`}
/>
<MapPin size={12} className="absolute left-3 top-3 text-gray-400" />
{errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
```

**Field MeetLink (Online):**

```jsx
// CŨ:
<input type="text" name="meetLink" />

// MỚI:
<input
    type="url"
    name="meetLink"
    placeholder="Nhập đường dẫn (ví dụ: https://meet.google.com/...)"
    className={`${inputStyle} pl-8 ${errors.meetLink ? 'border-red-500' : ''}`}
/>
{errors.meetLink && <p className="text-red-500 text-xs mt-1">{errors.meetLink}</p>}
```

**Submit Button:**

```jsx
// CŨ:
<button type="submit">
    <Plus size={16} /> Thêm mới
</button>

// MỚI:
<button
    type="submit"
    disabled={isSubmitting}
    className={`... ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
>
    <Plus size={16} /> {isSubmitting ? 'Đang tạo...' : 'Thêm mới'}
</button>
```

---

## 3. THAY ĐỔI - Tutor ConsultationDetail

### File: `frontend/src/pages/tutor/ConsultationDetail/index.jsx`

#### **Import thêm:**

```javascript
import {
  validateSessionForm,
  displayValidationErrors,
  formatApiError,
} from "../../../utils/validation";
```

#### **State mới:**

```javascript
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
```

#### **Thay đổi hàm `handleSave()`:**

**Code CŨ:**

```javascript
const handleSave = async () => {
  const confirmSave = window.confirm("Bạn có chắc chắn muốn lưu thay đổi?");
  if (confirmSave) {
    try {
      await sessionApi.update(uID, id, formData);
      alert("Lưu thành công!");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      alert("Lỗi khi lưu dữ liệu!");
    }
  }
};
```

**Code MỚI:**

```javascript
const handleSave = async () => {
  // Clear previous errors
  setErrors({});

  // Prepare data for validation
  const dataToValidate = {
    title: formData.title,
    date: formData.date,
    startTime: formData.startTime,
    duration: parseInt(formData.duration),
    isOnline: formData.isOnline,
    meetLink: formData.isOnline ? formData.meetLink : "",
    location: !formData.isOnline ? formData.location : "",
  };

  // Validate form data
  const validation = validateSessionForm(dataToValidate);

  if (!validation.valid) {
    setErrors(validation.errors);
    alert(displayValidationErrors(validation.errors));
    return;
  }

  const confirmSave = window.confirm("Bạn có chắc chắn muốn lưu thay đổi?");
  if (!confirmSave) return;

  setIsSubmitting(true);

  try {
    await sessionApi.update(uID, id, formData);
    alert("Lưu thành công!");
    setIsEditing(false);
    window.location.reload();
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu:", error);
    const errorMessage = formatApiError(error);
    alert("Lỗi khi lưu dữ liệu: " + errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
```

#### **Thay đổi JSX - Buttons:**

**Hủy & Lưu buttons:**

```jsx
// CŨ:
<button onClick={() => setIsEditing(false)}>Hủy</button>
<button onClick={handleSave}><CheckCircle size={14}/> Lưu</button>

// MỚI:
<button
    onClick={() => {
        setIsEditing(false);
        setErrors({});  // Clear errors khi cancel
    }}
    disabled={isSubmitting}
>
    Hủy
</button>
<button
    onClick={handleSave}
    disabled={isSubmitting}
    className={isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
>
    <CheckCircle size={14}/> {isSubmitting ? 'Đang lưu...' : 'Lưu'}
</button>
```

#### **Thay đổi JSX - Input fields tương tự ConsultationCreate:**

- Thêm error borders (border-red-500)
- Hiển thị error messages
- Change duration input từ `type="text"` sang `type="number"` với min/max/step

---

## 4. THAY ĐỔI - Student ConsultationRegister

### File: `frontend/src/pages/student/ConsultationRegister/index.jsx`

#### **Import thêm:**

```javascript
import { formatApiError } from "../../../utils/validation";
```

#### **Thay đổi hàm `handleRegister()`:**

**Code CŨ:**

```javascript
const handleRegister = async (sessionId) => {
  if (!window.confirm("Bạn có chắc muốn đăng ký buổi này?")) return;

  try {
    await studentSessionApi.registerSession(uID, sessionId);
    alert("Đăng ký thành công!");
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (isPopupOpen) setIsPopupOpen(false);
  } catch (error) {
    console.error(error);
    alert("Đăng ký thất bại! Vui lòng thử lại.");
  }
};
```

**Code MỚI:**

```javascript
const handleRegister = async (sessionId) => {
  if (!window.confirm("Bạn có chắc muốn đăng ký buổi này?")) return;

  try {
    setLoading(true);
    await studentSessionApi.registerSession(uID, sessionId);
    alert("Đăng ký thành công!");

    // Remove the registered session from the list
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    // Close popup if open
    if (isPopupOpen) setIsPopupOpen(false);
  } catch (error) {
    console.error("Register error:", error);
    const errorMessage = formatApiError(error);
    alert("Đăng ký thất bại! " + errorMessage);
  } finally {
    setLoading(false);
  }
};
```

**Điểm khác biệt:**

1. ✅ Thêm loading state khi đang xử lý
2. ✅ Parse error message từ API chi tiết hơn
3. ✅ Better error logging

---

## 5. THAY ĐỔI - API TutorSession.js

### File: `frontend/src/api/TutorSession.js`

#### **Hàm `update()`:**

**Code CŨ:**

```javascript
update: async (tutor_id, id, frontendData) => {
    try {
        // ... prepare payload
        const response = await fetch(...);

        if (!response.ok) throw new Error('Lỗi khi lưu');
        return await response.json();
    } catch (error) {
        throw error;
    }
}
```

**Code MỚI:**

```javascript
update: async (tutor_id, id, frontendData) => {
    try {
        const backendPayload = {
            // ... fields
            duration: parseInt(frontendData.duration), // ✅ Convert to integer
        };

        const response = await fetch(...);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || 'Lỗi khi lưu');
        }
        return await response.json();
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
}
```

#### **Hàm `create()`:**

**Thay đổi tương tự:**

1. ✅ Parse error response từ backend
2. ✅ Convert duration sang integer
3. ✅ Default value cho optional fields (students = [], document = [])
4. ✅ Better error logging

---

## 6. THAY ĐỔI - API StudentSession.js

### File: `frontend/src/api/StudentSession.js`

#### **Hàm `registerSession()`:**

**Code CŨ:**

```javascript
registerSession: async (studentId, sessionId) => {
    try {
        const response = await fetch(...);
        if (!response.ok) throw new Error('Đăng ký thất bại');
        return await response.json();
    } catch (error) {
        throw error;
    }
}
```

**Code MỚI:**

```javascript
registerSession: async (studentId, sessionId) => {
    console.log('Registering session:', studentId, sessionId);
    try {
        const response = await fetch(...);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || 'Đăng ký thất bại');
        }
        return await response.json();
    } catch (error) {
        console.error('Register session error:', error);
        throw error;
    }
}
```

---

## 7. THAY ĐỔI - Backend SchedulerView.py

### File: `backend/polls/view/SchedulerView.py`

#### **Hàm `_handle_post_create_session()`:**

**Code CŨ:**

```python
def _handle_post_create_session(self, request) -> Response:
    # ... generate id
    try:
        data = request.data
        new_session = Session(
            session_id,
            data['name'],
            data['tutor'],
            [],
            data['date'],
            data['time'],
            data['duration'],  # ⚠️ Không validate
            # ...
        )
    except KeyError as e:
        return Response({"error": f"Missing field: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    valid = self.controller.addSession(new_session)
    if valid:
        return Response({"message": f"Created {session_id}"})
    return Response({"error": "Lịch dạy bị trùng!"})
```

**Code MỚI:**

```python
def _handle_post_create_session(self, request) -> Response:
    # ... generate id
    try:
        data = request.data

        # ✅ Validate required fields
        required_fields = ['name', 'tutor', 'date', 'time', 'duration', 'online', 'address', 'description']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Validate duration
        try:
            duration = int(data['duration'])
            if duration < 15:
                return Response({"error": "Thời lượng phải ít nhất 15 phút"}, status=status.HTTP_400_BAD_REQUEST)
            if duration > 480:
                return Response({"error": "Thời lượng không được vượt quá 8 giờ (480 phút)"}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({"error": "Thời lượng phải là số nguyên"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Validate date format and not in past
        from datetime import datetime
        try:
            session_date = datetime.strptime(data['date'], '%Y-%m-%d')
            if session_date.date() < datetime.now().date():
                return Response({"error": "Ngày học không được ở quá khứ"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Định dạng ngày không hợp lệ (YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Validate time format
        import re
        if not re.match(r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$', data['time']):
            return Response({"error": "Định dạng giờ không hợp lệ (HH:MM)"}, status=status.HTTP_400_BAD_REQUEST)

        new_session = Session(
            session_id,
            data['name'],
            data['tutor'],
            [],
            data['date'],
            data['time'],
            duration,  # ✅ Đã validate
            data['online'],
            data['address'],
            data.get('link', data['address']),
            data['description'],
            data.get('note', ''),
            data.get('document', [])
        )
    except KeyError as e:
        return Response({"error": f"Missing field: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"Invalid data: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    valid = self.controller.addSession(new_session)
    if valid:
        return Response({"message": f"Created {session_id}", "id": session_id}, status=status.HTTP_200_OK)
    return Response({"error": "Lịch dạy bị trùng!"}, status=status.HTTP_400_BAD_REQUEST)
```

#### **Hàm `_handle_put_update_session()`:**

**Thay đổi tương tự:**

1. ✅ Check session tồn tại trước
2. ✅ Validate tất cả required fields
3. ✅ Validate duration (15-480 phút)
4. ✅ Validate date format và không ở quá khứ
5. ✅ Validate time format (HH:MM)
6. ✅ Check schedule conflicts với `checkDate()`
7. ✅ Proper exception handling
8. ✅ Return detailed error messages

---

## TÓM TẮT CÁC RULES VALIDATION

### Frontend Validation:

- ✅ **Title:** 3-200 ký tự, không để trống
- ✅ **Date:** Định dạng YYYY-MM-DD, không ở quá khứ
- ✅ **Time:** Định dạng HH:MM (00:00 - 23:59)
- ✅ **Duration:** 15-480 phút, bội số của 5
- ✅ **Location:** Bắt buộc khi offline
- ✅ **MeetLink:** Optional khi online, validate URL nếu có
- ✅ **DateTime combined:** Thời gian session phải ở tương lai

### Backend Validation:

- ✅ **Required fields:** name, tutor, date, time, duration, online, address, description
- ✅ **Duration:** Số nguyên, 15-480 phút
- ✅ **Date:** Format YYYY-MM-DD, không ở quá khứ
- ✅ **Time:** Format HH:MM với regex
- ✅ **Schedule conflict:** Check trùng lịch với sessions khác

---

## FLOW XỬ LÝ MỚI

```
User fills form
    ↓
Click Submit
    ↓
Frontend Validation (validateSessionForm)
    ↓
[If Invalid] → Display errors → Stop
    ↓
[If Valid] → Confirm dialog
    ↓
[If Confirmed] → Send to Backend API
    ↓
Backend Validation
    ↓
[If Invalid] → Return HTTP 400 + Error Message
    ↓
Frontend catches error → formatApiError() → Alert user
    ↓
[If Valid] → Process & Save
    ↓
Return Success → Alert user → Redirect/Reload
```

---

## FILES ĐƯỢC THAY ĐỔI

1. ✅ `frontend/src/utils/validation.js` - **TẠO MỚI**
2. ✅ `frontend/src/pages/tutor/ConsultationCreate/index.jsx` - **SỬA**
3. ✅ `frontend/src/pages/tutor/ConsultationDetail/index.jsx` - **SỬA**
4. ✅ `frontend/src/pages/student/ConsultationRegister/index.jsx` - **SỬA**
5. ✅ `frontend/src/api/TutorSession.js` - **SỬA**
6. ✅ `frontend/src/api/StudentSession.js` - **SỬA**
7. ✅ `backend/polls/view/SchedulerView.py` - **SỬA**
