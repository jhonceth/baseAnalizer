"use client";

import { useFarcasterContext } from "@/hooks/use-farcaster-context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { User, LogOut, Copy, ExternalLink, Wallet } from "lucide-react";
import { sdk } from "@farcaster/miniapp-sdk";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useState } from "react";

export default function UserInfo() {
  const { isInFarcaster, userInfo } = useFarcasterContext();
  const [copied, setCopied] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);

  // No mostrar si no estamos en Farcaster
  if (!isInFarcaster) {
    return null;
  }

  // Si no hay userInfo, mostrar un estado de carga o mensaje
  if (!userInfo) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
        <div className="h-8 w-8 bg-gray-600 rounded-full animate-pulse"></div>
        <div className="flex flex-col">
          <div className="h-4 w-20 bg-gray-600 rounded animate-pulse"></div>
          <div className="h-3 w-16 bg-gray-600 rounded animate-pulse mt-1"></div>
        </div>
      </div>
    );
  }

  const { fid, username, displayName, pfpUrl, walletAddress } = userInfo;

  const handleClose = async () => {
    try {
      console.log("🚪 Cerrando Mini App...");
      await sdk.actions.close();
    } catch (error) {
      console.error("❌ Error cerrando app:", error);
    }
  };

  const handleCopyFid = () => {
    if (fid) {
      navigator.clipboard.writeText(fid.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyWallet = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    }
  };

  const handleViewOnExplorer = () => {
    if (fid) {
      window.open(`https://warpcast.com/${username}`, "_blank");
    }
  };

  const handleViewWalletOnExplorer = () => {
    if (walletAddress) {
      window.open(`https://basescan.org/address/${walletAddress}`, "_blank");
    }
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 p-2 h-auto bg-gray-800 hover:bg-gray-700 text-white">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={pfpUrl || undefined} 
              alt={displayName || username || "Usuario"}
            />
            <AvatarFallback className="bg-purple-600 text-white">
              {displayName?.charAt(0) || username?.charAt(0) || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-white">
              {displayName || username || "Usuario"}
            </span>
            {username && (
              <span className="text-xs text-gray-300">
                @{username}
              </span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 bg-gray-900 border-gray-700 text-white">
        <DropdownMenuLabel className="flex items-center gap-3 p-3 text-white">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={pfpUrl || undefined} 
              alt={displayName || username || "User"}
            />
            <AvatarFallback className="bg-purple-600 text-white">
              {displayName?.charAt(0) || username?.charAt(0) || <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-white">{displayName || username || "User"}</span>
            {username && (
              <span className="text-sm text-gray-300">@{username}</span>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Información del FID */}
        {fid && (
          <div className="p-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Farcaster ID</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs text-white border-gray-600">
                  {fid}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyFid}
                  className="h-6 w-6 p-0 text-gray-300 hover:text-white"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {copied && (
              <span className="text-xs text-green-400 mt-1">Copied!</span>
            )}
          </div>
        )}

        {/* Información de la Wallet */}
        <div className="p-3 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300 flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              Wallet
            </span>
            <div className="flex items-center gap-2">
              {walletAddress ? (
                <>
                  <Badge variant="outline" className="text-xs text-white border-gray-600">
                    {formatWalletAddress(walletAddress)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyWallet}
                    className="h-6 w-6 p-0 text-gray-300 hover:text-white"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                  Not Connected
                </Badge>
              )}
            </div>
          </div>
          {walletAddress && copiedWallet && (
            <span className="text-xs text-green-400 mt-1">Copied!</span>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Opciones */}
        <DropdownMenuItem onClick={handleViewOnExplorer} className="text-white hover:bg-gray-800">
          <ExternalLink className="mr-2 h-4 w-4" />
          Farcaster
        </DropdownMenuItem>
        
        {walletAddress && (
          <DropdownMenuItem onClick={handleViewWalletOnExplorer} className="text-white hover:bg-gray-800">
            <ExternalLink className="mr-2 h-4 w-4" />
            Basescan
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem onClick={handleClose} className="text-red-400 hover:bg-gray-800">
          <LogOut className="mr-2 h-4 w-4" />
          Close App
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}