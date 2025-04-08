import heapq
from collections import defaultdict

def process_text_log_file(file_path, top_n, chunk_size=100000):
    error_counts = defaultdict(int)
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if "Error:" in line:
                error_code = line.split("Error:")[1]
                error_counts[error_code] += 1

    top_errors = heapq.nlargest(top_n, error_counts.items(), key=lambda x: x[1])

    return top_errors

path = r"C:\Users\This User\Documents\תרגיל בית הדסים\קבצים שנשלחו\log.txt"

top_errors = process_text_log_file(path, 5)

print("Nקודי השגיאה השכיחים ביותר:\n")
for error_code, count in top_errors:
    print(f"{error_code}: {count}")

#ניתוח זמן ריצה:
#O(L + U * log N)-כאשר:U = מספר קודי שגיאה שונים,N = מספר השגיאות הכי נפוצות שצריך להחזיר,L=מספר שורות בקובץ
#ניתוח סיבוכיות זכרון:
#O(U)