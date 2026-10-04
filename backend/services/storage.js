import { createClient } from '@supabase/supabase-js';
import multer from 'multer';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('⚠️ Ошибка: Не заданы SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY в переменных окружения!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const upload = multer({ storage: multer.memoryStorage() });

export async function uploadFileToSupabase(file) {
    const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const safeName = decodedName.replace(/\s+/g, '_');
    const uniqueSuffix = Date.now();


    const fileName = `${uniqueSuffix}-${safeName}`;

    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
        .from('study-files') // Имя вашего бакета
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) {
        throw new Error(`Ошибка загрузки в Supabase Storage: ${error.message}`);
    }

    // Получаем прямую публичную ссылку на файл
    const { data: publicURLData } = supabase.storage
        .from('study-files')
        .getPublicUrl(filePath);

    return {
        url: publicURLData.publicUrl,
        name: file.originalname
    };
}

export { upload };