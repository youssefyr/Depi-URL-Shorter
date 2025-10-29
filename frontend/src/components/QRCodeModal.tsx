import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeModalProps {
  url: string;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-primary dark:bg-dark-primary rounded-2xl shadow-neumorphic dark:shadow-neumorphic-dark p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Scan QR Code</h3>
        <div className="p-4 bg-white rounded-lg">
          <QRCode value={url} size={256} />
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-4 break-all">{url}</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-neumorphic hover:shadow-neumorphic-inset active:shadow-neumorphic-inset transition-all duration-200 font-semibold focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;