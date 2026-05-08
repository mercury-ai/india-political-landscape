export default function Footer() {
  return (
    <footer className="text-center text-xs text-neutral-600 py-3 px-4">
      Map data &copy;{' '}
      <a
        href="https://commons.wikimedia.org/wiki/File:Political_map_of_India_EN.svg"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-neutral-400"
      >
        Wikimedia Commons contributors
      </a>
      , CC BY-SA 3.0
    </footer>
  )
}
