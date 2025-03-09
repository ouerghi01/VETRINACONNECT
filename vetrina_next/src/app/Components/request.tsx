import { useActionState, useEffect, useState } from "react";
import { createRequestAction } from "../actions/request";
import { X, Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RequestProps = {
    userId: string;
    productId: string;
    setShowreq: (showreq: boolean) => void;
};

export default function RequestProduct({ userId, productId, setShowreq }: RequestProps) {
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [errorMessage, formAction, isPending] = useActionState(
        createRequestAction,
        undefined
    );
    useEffect(() => {
        const card_request = document.getElementById('card_request');
        card_request?.addEventListener('mouseleave', (e: MouseEvent) => {
            if (e.target === card_request) {
            setShowreq(false);
            }
        });
        
       
    },[setShowreq])

    return (
        <section id="card_request" className="fixed inset-0 flex items-center justify-center opacity-95 z-50 bg-black bg-opacity-50">
            <Card className="w-full max-w-md relative animate-fade-in">
                <CardHeader>
                    <CardTitle className="text-center">Request Product</CardTitle>
                    <Button 
                        variant="ghost" 
                        className="absolute top-3 right-3 p-2" 
                        onClick={() => setShowreq(false)}
                    >
                        <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <input type="hidden" name="userId" value={userId} />
                        <input type="hidden" name="productId" value={productId} />
                        <input type="hidden" name="latitude" value={latitude} />
                        <input type="hidden" name="longitude" value={longitude} />

                        <div className="space-y-2">
                            <label htmlFor="numberClient" className="text-sm font-medium">Your Number</label>
                            <Input id="numberClient" name="numberClient" placeholder="Enter your number" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                            <Input id="quantity" name="quantity" placeholder="How many do you need?" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="location" className="text-sm font-medium">Location</label>
                            <Input id="location" name="location" placeholder="Enter your location" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <Textarea id="message" name="message" placeholder="Remarks about the product" />
                        </div>

                        <Button 
                            type="button" 
                            onClick={() => {
                                navigator.geolocation.getCurrentPosition((position) => {
                                    setLatitude(position.coords.latitude);
                                    setLongitude(position.coords.longitude);
                                });
                            }}
                            className="flex items-center gap-2 w-full"
                        >
                            <MapPin className="w-5 h-5" /> Get My Location
                        </Button>

                        <Button 
                            type="submit" 
                            className="w-full flex items-center justify-center gap-2" 
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Sending Request...
                                </>
                            ) : (
                                'Send Request'
                            )}
                        </Button>

                        {errorMessage && (
                            <p className="text-sm text-red-500 text-center">
                                {errorMessage.message || JSON.stringify(errorMessage.errors)}
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}
