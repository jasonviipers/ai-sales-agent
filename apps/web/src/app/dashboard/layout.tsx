import React from 'react'

interface LayoutProps {
    children: React.ReactNode
}
export default function ProtectedPage({ children }: LayoutProps) {
    return (
        <div>{children}</div>
    )
}