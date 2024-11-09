import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, MultiSelect, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { useMutation } from '@tanstack/react-query';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useCategories } from '@/shared/hooks/categories';
import { useAppDispatch } from '@/shared/hooks/redux';
import { PostService } from '@/shared/services/post.service';
import { activateConfetti } from '@/shared/store/features/confetti-slice';
import { CreatePostDto, CreatePostSchema } from '@/shared/types/interfaces';

export const CreatePostForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreatePostDto>({
    resolver: zodResolver(CreatePostSchema)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: PostService.create,
    onSuccess: ({ data: { id } }) => {
      dispatch(activateConfetti());
      notifications.show({
        message: 'Post created successfully',
        color: 'green'
      });
      navigate(`/post/${id}`);
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
    }
  });

  const onSubmit = (data: CreatePostDto) => {
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

      <Button disabled={!isValid} loading={isPending} type="submit" style={{ alignSelf: 'flex-start' }}>
        Create
      </Button>
    </Flex>
  );
};
