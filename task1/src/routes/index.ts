import { Express } from 'express';
import UrlController from '../controllers/urlController';

const urlController = new UrlController();

export default function setRoutes(app: Express) {
    app.post('/shorten', urlController.shortenUrl.bind(urlController));
    app.get('/:short_code', urlController.redirectUrl.bind(urlController));
}