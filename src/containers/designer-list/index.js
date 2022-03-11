import React, { memo, useEffect, useState } from 'react'
import cn from 'classnames'
import api from '@services/api/espa/api.service'

import styles from './styles.module.scss'
import DesignerCard from './designer-card'


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

const DesignerList = () => {
  const [designerList, setDesignerList] = useState([])
  const screenWidth = useWindowDimensions().width
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    screenWidth > 410 ? setIsMobile(false) : setIsMobile(true)
  }, [screenWidth])

  async function loadData() {
    const designers = await api.getAllDesigners() || []
    setDesignerList(designers.filter(designer => !designer.organization))
  }

  useEffect(() => {
    loadData()
  }, [])

  console.log('designerList: ', designerList)
  return (
    <>
      {!isMobile ? (
        <div className={cn(styles.wrapper)}>
          <img src='/images/global_designers.png' className='px-5' alt='' />
          <img src='/images/network.png' className='ml-10' alt='' />
          <div className={styles.container}>
            {designerList.map((designerItem, index) => (
              <DesignerCard item={designerItem} key={`designercard-${index}`}/>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ position: 'relative', height: 231, marginBottom: 20 }}>
            <img
              src='/images/global1.png'
              style={{ position: 'absolute', top: 0, height:98 }}
              alt=''
            />
            <img
              src='/images/designer1.png'
              style={{ position: 'absolute', top: 72, height: 81, marginLeft: 31 }}
              alt=''
            />
            <img
              src='/images/network1.png'
              style={{ position: 'absolute', top: 131, height:69,marginLeft:21}}
              alt=''
            />
          </div>
          <div style={{display: 'flex',flexWrap: 'wrap', flexDirection: 'row'}}>
            {designerList.map((designerItem, index) => (
              <DesignerCard item={designerItem} key={`designercard-${index}`}/>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default memo(DesignerList)
