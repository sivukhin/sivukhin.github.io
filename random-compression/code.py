import random
def random_bytes(count, p):
    bit_string = ''.join(['1' if random.random() < p else '0' for _ in range(8 * count)])
    return bytes([int(bit_string[8*b:8*(b+1)], 2) for b in range(0, count)])

def generate():
    import numpy as np
    for p in np.linspace(0, 1, 41):
        open(f'{p:.4f}_1mb.bin', 'wb').write(random_bytes(1024 * 1024, p))
        print(f'written data for probability {p}')

def compress(command):
    import os
    import tempfile
    import subprocess
    import pandas as pd
    input_size, compressed_size, p = [], [], []
    for file in sorted(os.listdir('.')):
        if not file.endswith('.bin'): continue
        output = tempfile.mktemp(suffix='.compression-temp')
        try:
            subprocess.check_output(command.format(input=file, output=output), shell=True)
            input_size.append(os.stat(file).st_size)
            compressed_size.append(os.stat(output).st_size)
            p.append(float(file.split('_')[0]))
        finally:
            os.remove(output)
    return pd.DataFrame({'input_size': input_size, 'compressed_size': compressed_size, 'p': p})

def compare():
    import pandas as pd
    levels = list(range(1, 23))
    zstd_levels = []
    for level in levels:
        result = compress(f'/home/sivukhin/soft/zstd-1.5.5/programs/zstd --ultra -{level} {{input}} -o {{output}}')
        result['level'] = level
        zstd_levels.append(result)
    zstd = pd.concat(zstd_levels, ignore_index=True)
    zstd.to_csv('zstd.csv', index=None)

import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
def analyze():
    zstd = pd.read_csv('zstd.csv')
    zstd.loc[:, 'q'] = 1 - zstd['p']
    zstd.loc[:, 'lower_bound'] = zstd['input_size'] * (zstd['p'] * np.log2(1 / zstd['p']) + zstd['q'] * np.log2(1 / zstd['q']))
    zstd.loc[zstd['p'] == 0.0, 'lower_bound'] = 0
    zstd.loc[zstd['q'] == 0.0, 'lower_bound'] = 0
    zstd.loc[:, 'delta'] = zstd['compressed_size'] - zstd['lower_bound']
    zstd.loc[:, 'delta_ratio'] = zstd['delta'] / zstd['lower_bound']
    fig, ax = plt.subplots(figsize=(13, 6))
    plt.ticklabel_format(style='plain', axis='y')
    sns.lineplot(zstd, x='p', y='compressed_size', hue='level', ax=ax, legend='full')
    sns.lineplot(zstd[zstd['level'] == 1], x='p', y='lower_bound', ax=ax, legend='full')
    ax.set_title('zstd@1.5.5 compressed size', loc='left')
    ax.set_title('1MB of random bits with fixed probability of 1', loc='right')
    ax.set_xticks(np.linspace(0, 1, 11))
    ax.set_yticks(range(0, 1024 * 1024 + 1, 64*1024))
    ax.set_yticklabels([f'{x // 1024} KB' for x in range(0, 1024**2 + 1, 64*1024)])
    box = ax.get_position()
    ax.set_position([box.x0, box.y0, box.width * 0.8, box.height])
    ax.legend(loc='upper left', bbox_to_anchor=(1, 1))
    fig.figure.savefig('zstd_graph.png', bbox_inches='tight')

    fig, ax = plt.subplots(figsize=(13, 6))
    plt.ticklabel_format(style='plain', axis='y')
    sns.lineplot(zstd, x='p', y='delta_ratio', hue='level', ax=ax, legend='full')
    ax.set_title('zstd@1.5.5 relative to lower bound', loc='left')
    ax.set_title('1MB of random bits with fixed probability of 1', loc='right')
    ax.set_xticks(np.linspace(0, 1, 11))
    ax.set_yticks(np.linspace(0, 0.6, 21))
    ax.set_yticklabels([f'{x * 100:.2f}%' for x in np.linspace(0, 0.6, 21)])
    ax.axhline(y=0.01, color='gray', alpha=0.5, linestyle='--')
    box = ax.get_position()
    ax.set_position([box.x0, box.y0, box.width * 0.8, box.height])
    ax.legend(loc='upper left', bbox_to_anchor=(1, 1))
    fig.figure.savefig('zstd_delta.png', bbox_inches='tight')

    zstd = zstd[(0.4 <= zstd['p']) & (zstd['p'] <= 0.6)].copy()
    fig, ax = plt.subplots(figsize=(13, 6))
    plt.ticklabel_format(style='plain', axis='y')
    sns.lineplot(zstd, x='p', y='delta_ratio', hue='level', ax=ax, legend='full')
    ax.set_title('zstd@1.5.5 relative to lower bound', loc='left')
    ax.set_title('1MB of random bits with fixed probability of 1', loc='right')
    ax.set_xticks(np.linspace(0.4, 0.6, 11))
    ax.set_yticks(np.linspace(0, 0.6, 21))
    ax.set_yticklabels([f'{x * 100:.2f}%' for x in np.linspace(0, 0.6, 21)])
    ax.axhline(y=0.01, color='gray', alpha=0.5, linestyle='--')
    box = ax.get_position()
    ax.set_position([box.x0, box.y0, box.width * 0.8, box.height])
    ax.legend(loc='upper left', bbox_to_anchor=(1, 1))
    fig.figure.savefig('zstd_delta_zoom.png', bbox_inches='tight')



if __name__ == '__main__':
    #generate()
    #compare()
    analyze()
