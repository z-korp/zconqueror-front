import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const joinFormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  game_id: z.coerce.number().refine((value) => !isNaN(value) && value >= 0, {
    message: 'Game id cannot be negative',
  }),
});

interface JoinGameFormProps {
  onFormSubmit: (data: z.infer<typeof joinFormSchema>) => void;
}

const JoinGameForm: React.FC<JoinGameFormProps> = ({ onFormSubmit }) => {
  const form = useForm<z.infer<typeof joinFormSchema>>({
    defaultValues: {
      username: 'Player 2',
      game_id: 0,
    },
    resolver: zodResolver(joinFormSchema),
    mode: 'onChange', // Add this line to enable form validation on change
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(form.formState.isValid);
  }, [form.formState.isValid]);

  function onSubmit(data: z.infer<typeof joinFormSchema>) {
    // Check if the form is valid
    if (!isFormValid) {
      // If the form is not valid, simply return without triggering the callback
      return;
    }

    onFormSubmit(data);

    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="game_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game id</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default JoinGameForm;
