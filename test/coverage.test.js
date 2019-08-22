
import {getCoverage} from '../src/maineffect'
import { create } from 'istanbul-reports'
import libReport from  'istanbul-lib-report'

after(() => {
    const context = libReport.createContext({
        coverageMap: global.coverageMap
    })
    
    const created = create('text', {
        skipEmpty: false,
        skipFull: false,
        maxCols: process.stdout.columns || 100
    })

    created.execute(context)
})

