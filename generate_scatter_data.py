import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import multivariate_normal

cmap = plt.get_cmap('plasma')

mu = np.random.random((3))
cov = np.random.random((3, 3))
cov = cov @ cov.T
mn = multivariate_normal(mu, cov)

xyz = mn.rvs(int(1e3))
p = mn.pdf(xyz).reshape(-1,1)
#rbg = cmap(p / p.max())[:,:-1] * 255

data = np.concatenate([xyz, p], axis=1).flatten()

with open('data.bin', 'wb') as f: f.write(data.tobytes())
