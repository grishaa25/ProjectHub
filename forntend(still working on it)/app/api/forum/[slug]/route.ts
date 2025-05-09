import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // TODO: Delete forum from database
    // Example with Prisma:
    // await prisma.forum.delete({
    //   where: { slug },
    //   include: {
    //     messages: true // This will cascade delete messages if configured
    //   }
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete forum:', error)
    return NextResponse.json(
      { error: 'Failed to delete forum' },
      { status: 500 }
    )
  }
}
