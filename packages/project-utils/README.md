# project-utils (@-xun/project)

Everything exported by this library exposes both synchronous and asynchronous
interfaces.

Also, this terminology that needs to be listed somewhere:

- [`subpath`][1]: the keys of the `package.json` `exports` object defining entry
  points for the library, or of the `package.json` `imports` object defining
  custom import aliases.
- `entry point`: a string used to import a package or a part of a package.
- `target`: the string to which an entry point is mapped, or the from which an
  entry point is reverse-mapped.

[1]: https://nodejs.org/api/packages.html#subpath-exports
