import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { LS } from '@/shared/api'
import { onMounted } from 'vue'

import { getDays } from '../api'

export const useGroupStore = defineStore('groups', () => {
    const groupInfo = ref(LS.get('course'))
    const subgroup = ref(LS.get('subgroup'))

    const days = ref(LS.get('days') || null)

    const sliderMode = (LS.get('slider') ?? 'fade')

    onMounted(() => {
        if (groupInfo.value?.link) {
            getLessons(groupInfo.value.link)
        }
    })

    watch(groupInfo, (val) => {
        getLessons(val.link)
    })

    const getLessons = async (link) => {
        const response = await getDays(link)

        if (response.length && response) {

            LS.set('days', response)
            days.value = response
        }

    }


    return {
        groupInfo, days, subgroup, sliderMode
    }
})