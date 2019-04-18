// Libraries
import React, {FunctionComponent} from 'react'

// Components
import GaugeChart from 'src/shared/components/GaugeChart'
import SingleStat from 'src/shared/components/SingleStat'
import SingleStatTransform from 'src/shared/components/SingleStatTransform'
import TableGraphs from 'src/shared/components/tables/TableGraphs'
import DygraphContainer from 'src/shared/components/DygraphContainer'
import Histogram from 'src/shared/components/Histogram'
import HistogramTransform from 'src/shared/components/HistogramTransform'

// Types
import {
  QueryViewProperties,
  ViewType,
  SingleStatView,
  XYView,
  XYViewGeom,
} from 'src/types/dashboards'
import {FluxTable, RemoteDataState, TimeRange} from 'src/types'

interface Props {
  viewID: string
  tables: FluxTable[]
  loading: RemoteDataState
  properties: QueryViewProperties
  timeRange?: TimeRange
  onZoom?: (range: TimeRange) => void
}

const QueryViewSwitcher: FunctionComponent<Props> = ({
  properties,
  loading,
  viewID,
  tables,
  onZoom,
  timeRange,
}) => {
  switch (properties.type) {
    case ViewType.SingleStat:
      return (
        <SingleStatTransform tables={tables}>
          {stat => <SingleStat stat={stat} properties={properties} />}
        </SingleStatTransform>
      )
    case ViewType.Table:
      return <TableGraphs tables={tables} properties={properties} />
    case ViewType.Gauge:
      return <GaugeChart tables={tables} properties={properties} />
    case ViewType.XY:
      return (
        <DygraphContainer
          tables={tables}
          viewID={viewID}
          onZoom={onZoom}
          loading={loading}
          timeRange={timeRange}
          properties={properties}
        />
      )
    case ViewType.LinePlusSingleStat:
      const xyProperties = {
        ...properties,
        colors: properties.colors.filter(c => c.type === 'scale'),
        type: ViewType.XY,
        geom: XYViewGeom.Line,
      } as XYView

      const singleStatProperties = {
        ...properties,
        colors: properties.colors.filter(c => c.type !== 'scale'),
        type: ViewType.SingleStat,
      } as SingleStatView

      return (
        <DygraphContainer
          tables={tables}
          viewID={viewID}
          onZoom={onZoom}
          loading={loading}
          timeRange={timeRange}
          properties={xyProperties}
        >
          <SingleStatTransform tables={tables}>
            {stat => (
              <SingleStat stat={stat} properties={singleStatProperties} />
            )}
          </SingleStatTransform>
        </DygraphContainer>
      )
    case ViewType.Histogram:
      return (
        <HistogramTransform tables={tables}>
          {table => <Histogram table={table} properties={properties} />}
        </HistogramTransform>
      )
    default:
      return <div />
  }
}

export default QueryViewSwitcher
