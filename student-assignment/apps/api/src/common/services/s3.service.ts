import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
    private s3Client: S3Client | null = null;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        const region = this.configService.get('AWS_REGION') || 'us-east-1';
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

        this.bucketName = 'pos-files.660341453648';

        if (!accessKeyId || !secretAccessKey) {
            console.warn('AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY not defined. S3 upload will fail.');
            return;
        }

        this.s3Client = new S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        if (!this.s3Client) {
            throw new InternalServerErrorException('AWS Credentials not configured');
        }

        // Sanitize filename: replace spaces with _ to prevent URL issues
        const sanitizedFilename = file.originalname.replace(/\s+/g, '_');
        const key = `${uuidv4()}-${sanitizedFilename}`;

        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    // ACL: 'public-read', // Ideally, but depends on bucket settings. Assuming bucket policy allows public read or we return presigned.
                    // For this specific requested bucket name format, it implies a standard S3 setup.
                    // We'll return the standard S3 URL.
                }),
            );

            // Return path-style URL: https://s3.region.amazonaws.com/bucket-name/key
            const region = this.configService.get('AWS_REGION') || 'us-east-1';
            return `https://s3.${region}.amazonaws.com/${this.bucketName}/${key}`;
        } catch (error) {
            console.error('S3 Upload Error', error);
            throw new InternalServerErrorException('Failed to upload file to S3');
        }
    }
}
