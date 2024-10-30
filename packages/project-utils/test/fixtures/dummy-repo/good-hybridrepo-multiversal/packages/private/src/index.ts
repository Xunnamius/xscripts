import 'some-package';
// ? Self-referential
import { something } from 'rootverse+private:src/lib/library2.ts'

// eslint-disable-next-line no-console
console.log('raw source code here');
