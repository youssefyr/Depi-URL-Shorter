import { Request, Response } from 'express';
import { isValidUrl } from '../utils/validators';
import { ShortenerService } from '../services/shortener';

class UrlController {
    private urlService: ShortenerService;

    constructor(urlService?: ShortenerService) {
        this.urlService = urlService || new ShortenerService();
    }

    async shortenUrl(req: Request, res: Response) {
        const longUrl = req.body.longUrl;
        if (!isValidUrl(longUrl)) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const shortCode = await this.urlService.shortenUrl(longUrl);
        return res.status(201).json({ shortCode });
    }

    async redirectUrl(req: Request, res: Response) {
        const shortCode = req.params.short_code as string;
        const longUrl = await this.urlService.getLongUrl(shortCode);

        if (!longUrl) {
            return res.status(404).json({ error: 'URL not found' });
        }

        return res.redirect(longUrl);
    }
}

export default UrlController;