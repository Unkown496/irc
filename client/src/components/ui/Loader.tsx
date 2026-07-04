import { Loader2 } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" width={24} height={24} />
    </div>
  );
}
