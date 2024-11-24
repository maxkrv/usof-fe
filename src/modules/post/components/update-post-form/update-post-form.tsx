import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, MultiSelect, Switch, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { POST_BY_ID } from '@/shared/constants/query-keys';
import { useCategories } from '@/shared/hooks/categories';
import { useAppDispatch } from '@/shared/hooks/redux';
import { PostService } from '@/shared/services/post.service';
import { activateConfetti } from '@/shared/store/features/confetti-slice';
import { PostResponse, UpdatePostDto, UpdatePostSchema } from '@/shared/types/interfaces';

interface UpdatePostFormProps {
  initialData: PostResponse;
}

export const UpdatePostForm: FC<UpdatePostFormProps> = ({ initialData }) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm<UpdatePostDto>({
    resolver: zodResolver(UpdatePostSchema),
    defaultValues: {
      title: initialData.title,
      content: initialData.content,
      categoryIds: initialData.categories.map((category) => category.id),
      status: initialData.status
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdatePostDto) => PostService.update(initialData.id, data),
    onSuccess: () => {
      dispatch(activateConfetti());
      notifications.show({
        message: 'Post updated successfully',
        color: 'green'
      });
      navigate(`/post/${initialData.id}`);
      queryClient.invalidateQueries({ queryKey: [POST_BY_ID, String(initialData.id)] });
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    onUpdate: ({ editor }) => {
      setValue('content', editor.getHTML());
    },
    content: initialData.content
  });

  const onSubmit = (data: UpdatePostDto) => {
    mutate(data);
  };

  const isValid = watch('title')?.length && editor?.getText().length && watch('categoryIds')?.length;

  return (
    <Flex component="form" direction="column" gap="sm" onSubmit={handleSubmit(onSubmit)}>
      <TextInput {...register('title')} label="Title" error={errors.title?.message} maw={300} />

      <MultiSelect
        disabled={isLoadingCategories}
        value={watch('categoryIds')?.map((id) => id.toString())}
        data={categories?.map((category) => ({ value: category.id.toString(), label: category.title }))}
        onChange={(value) =>
          setValue(
            'categoryIds',
            value.map((id) => Number(id))
          )
        }
        label="Categories"
        maw={300}
      />

      <div>
        <Text component="label" size="sm">
          Content
        </Text>

        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />
        </RichTextEditor>
      </div>

      <Switch
        checked={watch('status') === 'ACTIVE'}
        onChange={(event) => setValue('status', event.currentTarget.checked ? 'ACTIVE' : 'INACTIVE')}
        label="Is active"
      />

      <Button disabled={!isValid} loading={isPending} type="submit" style={{ alignSelf: 'flex-start' }}>
        Update
      </Button>
    </Flex>
  );
};
