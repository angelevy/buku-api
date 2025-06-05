import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./data/db.json');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const email = req.query.email;
    const data = JSON.parse(fs.readFileSync(filePath));
    const filtered = data.filter(item => item.email === email);
    res.status(200).json(filtered);
  }

  else if (req.method === 'POST') {
    const { title, author, coverUrl, email } = req.body;
    const data = JSON.parse(fs.readFileSync(filePath));
    const newBook = {
      id: Date.now().toString(),
      title,
      author,
      coverUrl,
      email
    };
    data.push(newBook);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(201).json({ message: 'Buku berhasil ditambahkan' });
  }

  else if (req.method === 'DELETE') {
    const { id, email } = req.body;
    let data = JSON.parse(fs.readFileSync(filePath));
    const before = data.length;
    data = data.filter(item => !(item.id === id && item.email === email));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    if (data.length < before) {
      res.status(200).json({ message: 'Buku berhasil dihapus' });
    } else {
      res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
  }

  else {
    res.status(405).json({ message: 'Method tidak diizinkan' });
  }
}
