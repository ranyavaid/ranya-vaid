import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function publicAssetVersion(relativePath: string): Plugin {
  const virtualModuleId = `virtual:public-asset-version/${relativePath}`
  const resolvedVirtualModuleId = `\0${virtualModuleId}`
  const absolutePath = path.resolve('public', relativePath)

  return {
    name: `public-asset-version:${relativePath}`,
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) return

      const version = fs.existsSync(absolutePath)
        ? fs.statSync(absolutePath).mtimeMs
        : Date.now()

      return `export default ${JSON.stringify(String(version))}`
    },
    handleHotUpdate({ file, server }) {
      if (file !== absolutePath) return

      const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
      if (module) {
        server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
        return [module]
      }

      server.ws.send({ type: 'full-reload' })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    publicAssetVersion('okr Alignment/alignobj_kr.mp4'),
    publicAssetVersion('okr Alignment/assignkr_obj.mp4'),
    publicAssetVersion('okr Alignment/accept_obj.mp4'),
    publicAssetVersion('okr Alignment/editing.mp4'),
    publicAssetVersion('okr Alignment/alignkr_kr.mp4'),
    publicAssetVersion('okr Alignment/assignkr_kr.mp4'),
    publicAssetVersion('okr Alignment/accept_kr.mp4'),
    publicAssetVersion('okr Alignment/banner.mp4'),
    publicAssetVersion('PPN/accept_business.mp4'),
    publicAssetVersion('PPN/assign_rep.mp4'),
    publicAssetVersion('PPN/categories.mp4'),
    publicAssetVersion('PPN/enroll_subscription.mp4'),
    publicAssetVersion('PPN/banner.mp4'),
    publicAssetVersion('PPN/competitor.png'),
    publicAssetVersion('PPN/persona.png'),
    publicAssetVersion('PPN/problem_1.svg'),
    publicAssetVersion('PPN/problem_2.svg'),
    publicAssetVersion('PPN/problem_3.svg'),
    publicAssetVersion('PPN/service.png'),
    publicAssetVersion('PPN/subs_1.png'),
    publicAssetVersion('PPN/subs_2.png'),
    publicAssetVersion('PPN/subs_3.png'),
    publicAssetVersion('PPN/req_1.png'),
    publicAssetVersion('PPN/req_2.png'),
    publicAssetVersion('PPN/req_3.png'),
    publicAssetVersion('PPN/submit_request.mp4'),
    publicAssetVersion('PPN/AI.png'),
    publicAssetVersion('Trip-planning/banner.mp4'),
    publicAssetVersion('Trip-planning/primary-research.png'),
    publicAssetVersion('Trip-planning/5-whys.png'),
    publicAssetVersion('Trip-planning/rose-thorn.png'),
    publicAssetVersion('Trip-planning/effort-impact-matrix.png'),
    publicAssetVersion('Trip-planning/persona.png'),
    publicAssetVersion('Trip-planning/user_flow.png'),
    publicAssetVersion('Trip-planning/iteration_1.png'),
    publicAssetVersion('Trip-planning/iteration_2.png'),
    publicAssetVersion('Trip-planning/rollout.svg'),
    publicAssetVersion('Trip-planning/finals1.mp4'),
    publicAssetVersion('Trip-planning/finals2.mp4'),
    publicAssetVersion('Trip-planning/finals3.mp4'),
    publicAssetVersion('Trip-planning/finals4.mp4'),
    publicAssetVersion('Trip-planning/finals5.mp4'),
    publicAssetVersion('Trip-planning/finals6.mp4'),
    publicAssetVersion('Trip-planning/finals7.mp4'),
    publicAssetVersion('Trip-planning/finals8.mp4'),
    publicAssetVersion('Trip-planning/finals9.mp4'),
    publicAssetVersion('Trip-planning/finals10.mp4'),
    publicAssetVersion('Trip-planning/finals11.mp4'),
    publicAssetVersion('Trip-planning/finals12.mp4'),
    publicAssetVersion('Trip-planning/finals13.mp4'),
  ],
})
