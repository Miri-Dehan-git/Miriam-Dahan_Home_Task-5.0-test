import heapq
from collections import defaultdict
from itertools import islice

def process_text_log_file(file_path, top_n, chunk_size=100000):
    total_error_counts = defaultdict(int)

    with open(file_path, 'r', encoding='utf-8') as f:
        while True:
            lines = list(islice(f, chunk_size))
            if not lines:
                break

            chunk_error_counts = defaultdict(int)

            for line in lines:
                line = line.strip()
                if "Error:" in line:
                    error_code = line.split("Error:")[1].strip()
                    chunk_error_counts[error_code] += 1

            for code, count in chunk_error_counts.items():
                total_error_counts[code] += count


    top_errors = heapq.nlargest(top_n, total_error_counts.items(), key=lambda x: x[1])
    return top_errors

path = "C:\\Users\\This User\\Documents\\Miriam-Dahan_Home_Task-5.0-test\\תרגיל בית הדסים\\קבצים שנשלחו\\log.txt"
top_errors = process_text_log_file(path, top_n=5, chunk_size=50000)

print("\nקודי השגיאה השכיחים ביותר בכל הקובץ:\n")
for error_code, count in top_errors:
    print(f"{error_code}: {count}")


#ניתוח זמן ריצה:
#O(L + U * log N)-כאשר:U = מספר קודי שגיאה שונים,N = מספר השגיאות הכי נפוצות שצריך להחזיר,L=מספר שורות בקובץ
#ניתוח סיבוכיות זכרון:
#O(U)
