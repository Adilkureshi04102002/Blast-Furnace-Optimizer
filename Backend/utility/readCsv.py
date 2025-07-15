import pandas as pd 
import os


def readCsv(filename):
    # Use the provided filename directly since it's already an absolute path
    df = pd.read_csv(filename)
    return df 

def getVariableObjective(df):
	cols = df.columns
	variables  = df[[col for col in cols if 'y' in col]].values *100
	objectives = df[[col for col in cols if 'f' in col]].values

	return variables,objectives,variables.min(axis=0),variables.max(axis=0)










