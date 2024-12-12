export * from 'rootverse+project-utils:src/fs/well-known-constants.ts';
export * from 'rootverse+project-utils:src/fs/derive-virtual-gitignore-lines.ts';
export * from 'rootverse+project-utils:src/fs/derive-virtual-prettierignore-lines.ts';
export * from 'rootverse+project-utils:src/fs/is-accessible.ts';
export * from 'rootverse+project-utils:src/fs/read-json.ts';
export * from 'rootverse+project-utils:src/fs/read-jsonc.ts';
export * from 'rootverse+project-utils:src/fs/read-xpackage-json-at-root.ts';

export {
  getCurrentWorkingDirectory,
  getInitialWorkingDirectory,
  isAbsolutePath,
  isRelativePath,
  toAbsolutePath,
  toDirname,
  toPath,
  toRelativePath,
  type AbsolutePath,
  type Path,
  type RelativePath
} from 'rootverse+project-utils:src/fs/common.ts';
