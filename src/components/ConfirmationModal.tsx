import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning'
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: {
            icon: 'text-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            button: 'bg-red-500 hover:bg-red-600'
        },
        warning: {
            icon: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20',
            button: 'bg-yellow-500 hover:bg-yellow-600 text-black'
        },
        info: {
            icon: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            button: 'bg-blue-500 hover:bg-blue-600'
        }
    };

    const theme = colors[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${theme.bg} border ${theme.border}`}>
                            <AlertTriangle className={`w-6 h-6 ${theme.icon}`} />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/5"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg ${theme.button} ${type === 'warning' ? 'text-black' : 'text-white'}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
