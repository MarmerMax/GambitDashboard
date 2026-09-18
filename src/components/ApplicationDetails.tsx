import { CRITICALITIES } from '../types'
import type { Application, Resource } from '../types'
import { ApplicationGraph } from './ApplicationGraph'
import { Badge } from './Badge'
import { EmptyState } from './EmptyState'
import { IssueCount } from './IssueCount'

interface ApplicationDetailsProps {
    application?: Application
    resources: Resource[]
}

export const ApplicationDetails = ({ application, resources }: ApplicationDetailsProps) => (
    <section className="panel panel--wide" aria-labelledby="application-graph-heading">
        <header className="panel__header">
            <div>
                <h2 className="panel__title" id="application-graph-heading">
                    {application ? application.name : 'Application graph'}
                </h2>
                <p className="panel__subtitle">
                    {application?.description ??
                        (application
                            ? `${resources.length} connected resource${resources.length === 1 ? '' : 's'}`
                            : 'Select an application to see its resource graph')}
                </p>
            </div>
            {application && (
                <ul className="legend">
                    {CRITICALITIES.map((criticality) => (
                        <li className="legend__item" key={criticality}>
                            <span className={`legend__dot legend__dot--${criticality}`} />
                            {criticality}
                        </li>
                    ))}
                </ul>
            )}
        </header>

        {application ? (
            <>
                <ApplicationGraph application={application} resources={resources} />
                <ul className="member-list">
                    {resources.map((resource) => (
                        <li className="member-list__item" key={resource.id}>
                            <span>
                                <span className="resource-name">{resource.name}</span>
                                <span className="resource-meta">
                                    {resource.type} · {resource.region} · {resource.owner}
                                </span>
                            </span>
                            <span className="member-list__badges">
                                <Badge tone={resource.provider} />
                                <Badge tone={resource.environment} />
                                <Badge tone={resource.criticality} />
                                <IssueCount count={resource.openIssues} />
                            </span>
                        </li>
                    ))}
                </ul>
            </>
        ) : (
            <EmptyState
                title="No application selected"
                description="Create an application from selected resources, then click it to visualise how its resources connect."
            />
        )}
    </section>
)
