/* eslint-disable no-undef */
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// AWS S3 설정
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// S3 삭제 함수
export async function deleteImage(imageName) {
    if (!imageName) {
        console.error('imageName이 유효하지 않습니다:', imageName);
        return;
    }
    // S3에서 삭제할 Key 설정
    const key = `images/${imageName}`;
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
        console.log('S3 파일 삭제 성공:', key);
    } catch (error) {
        console.error('S3 파일 삭제 실패:', error);
    }
}
