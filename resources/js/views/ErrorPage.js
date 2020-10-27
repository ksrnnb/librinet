import Subtitle from '../components/Subtitle';
import React from 'react';

export default function ErrorPage() {
  return (
    <>
      <Subtitle subtitle="エラーページ" />
      <h2 className="text-danger mt-5">予期しないエラーが発生しました</h2>
    </>
  );
}
