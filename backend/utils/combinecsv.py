# to combine all csv files in a folder to a single csv(for data accumulation)

import os
import pandas as pd

folder_path = 'C:\Developer\csv'        # folder where all the csv to be merged are present
csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')]

dataframes = []

for file in csv_files:
    file_path = os.path.join(folder_path, file)
    df = pd.read_csv(file_path)
    dataframes.append(df)

combined_df = pd.concat(dataframes, ignore_index=True)

combined_df.to_csv('C:\Developer\combined\combined_data.csv', index=False)      # where the combined csv dataframe is to be stored

print("CSV files have been combined successfully!")
