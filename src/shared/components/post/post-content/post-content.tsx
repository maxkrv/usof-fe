import { RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import LinkExtension from '@tiptap/extension-link';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import classes from './post-content.module.css';

interface PostContentProps {
  id?: number;
  content: string;
  isFeed?: boolean;
}

export const PostContent: FC<PostContentProps> = ({ content, id, isFeed = false }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content,
    editable: false
  });

  return (
    <RichTextEditor editor={editor} style={{ border: 'none', position: 'relative' }}>
      <RichTextEditor.Content className={classNames(classes.content, { [classes.feed]: isFeed })} />

      {isFeed && <Link className={classes.link} to={`/post/${id}`} />}
    </RichTextEditor>
  );
};
