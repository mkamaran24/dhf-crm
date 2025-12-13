import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  itemName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Are you sure?
          </h3>

          <p className="text-gray-600 mb-2">
            You are about to delete{" "}
            <span className="font-semibold text-gray-900">{itemName}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors shadow-lg shadow-red-600/30"
            >
              Yes, delete it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

