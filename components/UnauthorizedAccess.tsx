import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX, Home } from "lucide-react";

export default function UnauthorizedAccess() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Access Denied
        </h1>
        
        <p className="text-light-100 mb-6">
          You don&apos;t have permission to access this page. 
          Admin privileges are required.
        </p>
        
        <Button asChild className="bg-primary-200 hover:bg-primary-200/80 text-dark-100">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
