import { QuartzFilterPlugin } from "../types"

export const RemoveDrafts: QuartzFilterPlugin<object> = () => ({
  name: "RemoveDrafts",
  shouldPublish(_ctx, [_tree, vfile]) {
    const draftFlag: boolean =
      vfile.data?.frontmatter?.draft === true || vfile.data?.frontmatter?.draft === "true"
    return !draftFlag
  },
})
