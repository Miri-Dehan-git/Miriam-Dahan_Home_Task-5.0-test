import pandas as pd
import os
from collections import defaultdict


def check_data_quality(df):
    df = df.copy()
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', utc=True)
    df = df.dropna(subset=['timestamp'])
    df = df.drop_duplicates(subset='timestamp', keep='first')
    df['value'] = pd.to_numeric(df['value'], errors='coerce')
    df = df.dropna(subset=['value'])
    return df


def read_file(file_path):
    if file_path.endswith('.csv'):
        return pd.read_csv(file_path)
    elif file_path.endswith('.parquet'):
        return pd.read_parquet(file_path)
    else:
        raise ValueError("פורמט הקובץ לא טוב. יש לספק קובץ CSV או PARQUET.")


def hourly_average_simpally(df, output_path='hourly_averages.csv'):
    df = check_data_quality(df)
    df['date'] = df['timestamp'].dt.floor('D')
    df['hour'] = df['timestamp'].dt.hour
    results = df.groupby(["date", "hour"]).agg({"value": "mean"}).reset_index()
    results['timestamp'] = results['date'] + pd.to_timedelta(results['hour'], unit='h')
    results = results[['timestamp', 'value']]
    results.to_csv(output_path, index=False, encoding='utf-8')
    print(results)
    return results


def split_by_date_and_save(df, output_dir="daily_chunks"):
    os.makedirs(output_dir, exist_ok=True)
    df['date'] = df['timestamp'].dt.date
    for date, group in df.groupby('date'):
        filename = os.path.join(output_dir, f"{date}.csv")
        group.drop(columns='date').to_csv(filename, index=False, encoding='utf-8')


def process_each_day_and_merge(daily_dir="daily_chunks", output_path="final_hourly_averages.csv"):
    all_results = []
    for filename in os.listdir(daily_dir):
        if filename.endswith(".csv"):
            full_path = os.path.join(daily_dir, filename)
            df = pd.read_csv(full_path)
            df = check_data_quality(df)
            df['timestamp'] = pd.to_datetime(df['timestamp'], utc=True)
            df['hour'] = df['timestamp'].dt.hour
            df['date'] = df['timestamp'].dt.floor('D')
            hourly_avg = df.groupby(['date', 'hour'])['value'].mean().reset_index()
            hourly_avg['timestamp'] = hourly_avg['date'] + pd.to_timedelta(hourly_avg['hour'], unit='h')
            hourly_avg = hourly_avg[['timestamp', 'value']]
            all_results.append(hourly_avg)

    final_df = pd.concat(all_results)
    final_df = final_df.sort_values('timestamp')
    final_df.to_csv(output_path, index=False, encoding='utf-8')
    print(final_df.head())

    for filename in os.listdir(daily_dir):
        file_path = os.path.join(daily_dir, filename)
        os.remove(file_path)


def read_file_by_split(file_path: str, chunksize: int = 100_000, daily_dir="daily_chunks"):
    if file_path.endswith('.csv'):
        reader = pd.read_csv(file_path, chunksize=chunksize)
    elif file_path.endswith('.parquet'):
        reader = [pd.read_parquet(file_path)]
    else:
        raise ValueError("פורמט הקובץ לא נתמך. יש לספק CSV או PARQUET.")

    for i, chunk in enumerate(reader):
        cleaned = check_data_quality(chunk)
        split_by_date_and_save(cleaned, output_dir=daily_dir)

    process_each_day_and_merge(daily_dir=daily_dir)


def convert_excel_to_csv(excel_path, csv_path):
    df = pd.read_excel(excel_path)
    df.to_csv(csv_path, index=False)


convert_excel_to_csv("C:\\Users\\This User\\Documents\\תרגיל בית הדסים\\קבצים שנשלחו\\time_series.xlsx",
                     r"C:\\Users\\This User\\Documents\\תרגיל בית הדסים\\קבצים שנשלחו\\time_series.csv")
csv_path = r"C:\\Users\\This User\\Documents\\תרגיל בית הדסים\\קבצים שנשלחו\\time_series.csv"
parquet_path = r"C:\\Users\\This User\\Documents\\תרגיל בית הדסים\\קבצים שנשלחו\\time_series (6).parquet"

df_csv = read_file(csv_path)
hourly_average_simpally(df_csv, output_path="hourly_averages_from_csv.csv")

read_file_by_split(csv_path)
read_file_by_split(parquet_path)

# תת סעיף 3- מידע המגיע בזרימה-STREAM
"""
במקרה שבו הנתונים מגיעים בזרימה (stream) ולא כקובץ שלם – לא ניתן לעבד את כל המידע בבת אחת. לכן יש לתכנן פתרון שבו נשמרים רק הנתונים הנחוצים לחישוב הממוצע עבור כל שעה, וכל זה מתעדכן בזמן אמת.

תיאור הביצוע:

שמירה בזיכרון של מבנה נתונים:
ניצור מילון(dictionary) שבו כל מפתח יהיה צירוף של "תאריך + שעה", למשל: "2025-04-08 14".
עבור כל מפתח כזה, נשמור שני דברים:

הסכום המצטבר של כל הערכים שהתקבלו באותה שעה.
מספר הערכים שהתקבלו באותה שעה (COUNT).

עוד מילון שמשמש לבדוק האם timestamp מסוים כבר התקבל בעבר – כדי למנוע כפילויות לפי timestamp.

בדיקה ועיבוד כל ערך חדש שמתקבל:
בכל פעם שמתקבל ערך חדש מהזרם:

נמיר את ה־timestamp שלו לפורמט של תאריך ושעה עגולה (למשל: "2025-04-08 14").

נבדוק אם כבר יש לנו מפתח כזה במבנה שלנו:

אם כן, נוסיף את הערך החדש לסכום, ונגדיל את הספירה באחד ונבדוק שהוא לא נמצא(ה timestamp המלא) במילון השני-המונע כפילויות של timestamps.

אם לא, ניצור רשומה חדשה עם סכום התחלתי שהוא הערך, וספירה של 1.

בכל רגע אפשר לחשב את הממוצע עבור כל שעה פשוט על־ידי חלוקה של הסכום בספירה.
"""
