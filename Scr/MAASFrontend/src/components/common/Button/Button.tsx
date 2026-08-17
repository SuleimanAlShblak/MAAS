import { cva } from 'class-variance-authority';
import { cn } from '@/utils/cs';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary',
};

const buttonVariants = cva('px-4 py-2 rounded-md font-semibold hover:opacity-50', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    },
   
  }, 
  defaultVariants: {
      variant: 'primary',
    },
});

export default function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <button {...props} className={cn(buttonVariants({ variant }), className)} />
);
}
