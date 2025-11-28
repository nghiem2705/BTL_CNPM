import os
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render

# Hàm này chạy khi người dùng truy cập trang chủ (URL: '')
def index(request):
    """
    Hiển thị trang HTML chính.
    """
    # Django sẽ tự động tìm trong thư mục 'templates'
    # (chúng ta sẽ tạo tệp này ở bước 6)
    return render(request, 'polls/index.html')

# Hàm này chạy khi JavaScript gọi URL '/load-data/'
def load_data(request):
    """
    Đọc dữ liệu từ tệp data.txt và trả về dưới dạng JSON.
    """
    # Xác định đường dẫn đến tệp data.txt
    # (Chúng ta sẽ đặt tệp này ở thư mục gốc, ngang hàng với manage.py)
    file_path = os.path.join(settings.BASE_DIR, 'data.txt')
    
    try:
        # Mở và đọc tệp text
        with open(file_path, 'r', encoding='utf-8') as f:
            data_content = f.read()
        
        # Trả về dữ liệu text, bọc trong một JSON object
        return JsonResponse({'content': data_content})
    
    except FileNotFoundError:
        return JsonResponse({'error': 'Không tìm thấy tệp data.txt!'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)