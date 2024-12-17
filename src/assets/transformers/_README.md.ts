/* eslint-disable unicorn/filename-case */
import { ProjectAttribute } from 'multiverse+project-utils:analyze.ts';

import {
  markdownReadmePackageBase,
  toRelativePath,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import {
  compileTemplate,
  makeTransformer,
  type TransformerContext
} from 'universe:assets.ts';

import { generatePerPackageAssets, generateRootOnlyAssets } from 'universe:util.ts';

function replaceStandardStrings(
  content: string,
  {
    repoName,
    projectMetadata: {
      cwdPackage: {
        json: { name: packageName }
      }
    }
  }: TransformerContext
) {
  // TODO: drop unused reference from package build explanation text

  // TODO: drop license section if no license

  // TODO: (should be hoisted?) preserve all numeric reference defs
  return content.replace(
    // ? Replace H1 with proper string
    /^# <!-- .+$/m,
    `# ${repoName} (${packageName})`
  );
}

function replaceRegionsRespectively(content: string, context: TransformerContext) {
  // TODO: implement regional replacements as function (count must match)
  return content;
}

export const { transformer } = makeTransformer(async function (context) {
  const {
    toProjectAbsolutePath,
    projectMetadata: {
      type,
      rootPackage: { attributes: projectAttributes }
    }
  } = context;

  return [
    ...// * Only the root package of a non-hybrid monorepo gets these files
    (await generateRootOnlyAssets(context, function () {
      if (
        type !== ProjectAttribute.Monorepo ||
        projectAttributes[ProjectAttribute.Hybridrepo]
      ) {
        return [];
      }

      return [
        {
          path: toProjectAbsolutePath(markdownReadmePackageBase),
          generate: async () => {
            return replaceRegionsRespectively(
              replaceStandardStrings(
                await compileTemplate(toRelativePath('README.monorepo.md'), context),
                context
              ),
              context
            );
          }
        }
      ];
    })),

    ...// * Every package gets these files except non-hybrid monorepo roots
    (await generatePerPackageAssets(context, async function ({ toPackageAbsolutePath }) {
      return [
        {
          path: toPackageAbsolutePath(markdownReadmePackageBase),
          generate: async () => {
            return replaceRegionsRespectively(
              replaceStandardStrings(
                await compileTemplate('README.package.md' as RelativePath, context),
                context
              ),
              context
            );
          }
        }
      ];
    }))
  ];
});
