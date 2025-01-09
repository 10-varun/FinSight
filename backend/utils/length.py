# to find length and print head

import pandas as pd

dataset = 'merged_data.csv'
data_df = pd.read_csv(dataset)

length = len(data_df)

print(f"Number of rows in the merged dataset: {length}")
print(data_df.head())