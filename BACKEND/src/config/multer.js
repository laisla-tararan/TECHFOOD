const multer = require('multer'); // Importação do Multer - Processa toda a operação.
const path = require('path'); // Importação do Path - Manipula os diretórios.

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/')
    },
    filename: (req, file, callback) => {
        const time = new Date().getTime(); //Capta a hora e data atual.
        const nomeOriginal = file.originalname.replace(/\s+/g, '-');
        const nomeArquivo = `${time}-${nomeOriginal}`; //Cria o nome do arquivo, que também atuará como ID da imagem.
        callback(null, nomeArquivo)
    }
})

const upload = multer({
    storage, 
    limits: { 
        fileSize: 5 * 1024 * 1024, //Define o tamanho de imagem permitido.
    },
    fileFilter: (req, file, callback) => {
        const tiposPermitidos = [ //Define os tipos de imagem aceitos.
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp',
        ];
        // Valida se a imagem está dentro dos tipos permitidos.
        if(tiposPermitidos.includes(file.mimetype)){
            callback(null, true);
        } else {
            callback(new Error('Tipo de arquivo inválido.'))
        }
    }
});

module.exports = upload;