import React, { memo } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import cn from 'classnames'
import styles from './styles.module.scss'

const DesignerCard = ({ item }) => {
  if (!item) {
    return null
  }

  return (
    <div className={cn(styles.wrapper)}>
      <Link href={encodeURI(`/designers/${item['designerId']}`)}>
        <a>
          <img src={item['image_url']} alt={item['designerId']} className={styles.photo} />
          <div className={styles.name}>{item['designerId']}</div>
        </a>
      </Link>
    </div>
  )
}

DesignerCard.propTypes = {
  item: PropTypes.object,
}

DesignerCard.defaultProps = {
  item: {},
}

export default memo(DesignerCard)
