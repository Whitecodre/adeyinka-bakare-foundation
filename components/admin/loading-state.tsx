interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#aa322b]"></div>
      {message && <p className="text-[#2d1816]/60">{message}</p>}
    </div>
  );
}
