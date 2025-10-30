import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeModalProps {
  url: string;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, onClose }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="QR Code"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-base-100 dark:bg-neutral rounded-2xl shadow-lg p-8 text-center max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-base-content mb-4">Scan QR Code</h3>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg inline-block">
          <QRCode value={url} size={256} />
        </div>

        <p className="text-sm text-base-content/70 mt-4 break-words">{url}</p>

        <button
          onClick={onClose}
          className="mt-6 btn btn-primary"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;