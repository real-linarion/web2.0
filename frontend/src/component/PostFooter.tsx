import React from 'react';
import styles from './PostFooter.module.css';

interface PostFooterProps {
  likes: number;
  dislikes: number;
  isComment: boolean;
}

export function PostFooter(props: PostFooterProps) {
  return getLayout(props);
}

function getLayout(props: PostFooterProps) {
  if (props.isComment) {
    return getLayoutForComment(props);
  } else {
    return getLayoutForPost(props);
  }
}

function getLayoutForComment(props: PostFooterProps) {
  return (
    <div className={styles['Post-Footer']}>
      <div className={styles['Post-Footer-Rating']}>{getRatingString(props)}</div>
    </div>
  );
}

function getLayoutForPost(props: PostFooterProps) {
  return (
    <div className={styles['Post-Footer']}>
      <input
        className={styles['Post-Footer-Comment']}
        type='text'
        id='comment'
        name='comment'
        placeholder='Kommentieren'
      ></input>
      <div className={styles['Post-Footer-Rating']}>{getRatingString(props)}</div>
    </div>
  );
}

function getRatingString(props: PostFooterProps) {
  return props.likes + ' Likes | ' + props.dislikes + ' Dislikes';
}
