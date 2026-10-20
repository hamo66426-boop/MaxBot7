import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import axios from 'axios';

const execAsync = promisify(exec);
const tmp = path.join(os.tmpdir(), 'bot-alhakam-gifs');
fs.mkdirSync(tmp, { recursive: true });

export async function gifToMp4(url) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const gifPath = path.join(tmp, `${id}.gif`);
  const mp4Path = path.join(tmp, `${id}.mp4`);

  try {
    const res = await axios.get(url, {
      responseType: 'stream',
      timeout: 30000
    });
    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(gifPath);
      res.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
      res.data.on('error', reject);
    });

    await execAsync(
      `ffmpeg -y -i "${gifPath}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -pix_fmt yuv420p -loglevel error "${mp4Path}"`
    );
    return fs.readFileSync(mp4Path);
  } finally {
    for (const file of [gifPath, mp4Path]) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
  }
}

export async function AnimeGif(type) {
  const headers = {
    'User-Agent': 'Mozilla/5.0',
    Accept: 'application/json'
  };
  const apis = [
    async () => {
      const r = await axios.get(`https://nekos.best/api/v2/${type}`, { timeout: 15000, headers });
      const item = r.data?.results?.[0];
      if (!item?.url) throw new Error('No GIF URL');
      return { url: item.url, anime_name: item.anime_name || 'أنمي' };
    },
    async () => {
      const r = await axios.get(`https://api.waifu.pics/sfw/${type}`, { timeout: 15000, headers });
      if (!r.data?.url) throw new Error('No GIF URL');
      return { url: r.data.url, anime_name: 'أنمي' };
    },
    async () => {
      const r = await axios.get(`https://api.otakugifs.xyz/gif?reaction=${type}`, { timeout: 15000, headers });
      if (!r.data?.url) throw new Error('No GIF URL');
      return { url: r.data.url, anime_name: 'أنمي' };
    }
  ];

  for (const api of apis) {
    try {
      return await api();
    } catch {}
  }
  throw new Error(`تعذر جلب GIF للنوع ${type}`);
}
