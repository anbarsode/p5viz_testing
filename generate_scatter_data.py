import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import multivariate_normal

cmap = plt.get_cmap('plasma')

mu = np.random.random((3))
cov = np.random.random((3, 3)) * 2 - 1;
cov = cov @ cov.T
mn = multivariate_normal(mu, cov)

xyz = mn.rvs(int(1e3))
w = mn.pdf(xyz).reshape(-1,1)
#rbg = cmap(w / w.max())[:,:-1] * 255

labels = ['SNR1', 'SNR2', 'log10 BLU', 'Chirp Mass']

labels = b''.join(s.encode('utf-8').ljust(16, b' ') for s in labels)
lims = np.vstack([xyz.min(axis=0), xyz.max(axis=0)]).T.flatten().tobytes()
data = np.concatenate([xyz, w], axis=1).flatten().tobytes()

with open('data.bin', 'wb') as f:
  f.write(labels)
  f.write(lims)
  f.write(data)
