import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(function ({
  asset,
  toProjectAbsolutePath
}) {
  // TODO: project-wide flags like project.<branch>
  return [
    {
      path: toProjectAbsolutePath(asset),
      generate: () => `
coverage:
  range: '75...100'
  status:
    project:
      default:
        informational: true
    patch:
      default:
        informational: true
# * Well-known flag syntax: package.<branch>_<package-id>
# * <package>-id will be the WorkspacePackageId or "root" for RootPackages
flag_management:
  # * These rules will apply to all non-specially-configured flags
  default_rules:
    carryforward: true
    statuses:
      - type: project
        target: auto
      - type: patch
        target: auto
`
    }
  ];
});
