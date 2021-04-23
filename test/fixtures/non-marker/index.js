export default function assertion(t, zone, tree) {
  zone(tree, 'foo', handle)

  function handle() {
    throw new Error('Should not be invoked')
  }
}
