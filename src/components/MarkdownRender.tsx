export default function MarkdownRender({ content }: { content: string }) {
  return <pre className='whitespace-pre-wrap'>{content}</pre>;
}
